const natural = require("natural");
const TfIdf = natural.TfIdf;
const Vector = require("vector-object");

class FoodRecommmendationSystem {
  constructor() {
    this.data = require("./data");
    this.recommendationData = {};
  }

  createVectorsFromDocs = () => {
    const tfidf = new TfIdf();

    data.forEach((processedDocument) => {
      tfidf.addDocument(processedDocument.content);
    });

    const documentVectors = [];

    for (let i = 0; i < data.length; i += 1) {
      const processedDocument = data[i];
      const obj = {};

      const items = tfidf.listTerms(i);

      for (let j = 0; j < items.length; j += 1) {
        const item = items[j];
        obj[item.term] = item.tfidf;
      }

      const documentVector = {
        id: processedDocument.id,
        vector: new Vector(obj),
      };

      documentVectors.push(documentVector);
    }
    return documentVectors;
  };

  calculateSimilarities = (docVectors) => {
    // number of results that you want to return.
    const MAX_SIMILAR = 3;
    // min cosine similarity score that should be returned.
    const MIN_SCORE = 0.2;
    const data = {};

    for (let i = 0; i < docVectors.length; i += 1) {
      const documentVector = docVectors[i];
      const { id } = documentVector;

      data[id] = [];
    }

    for (let i = 0; i < docVectors.length; i += 1) {
      for (let j = 0; j < i; j += 1) {
        const idi = docVectors[i].id;
        const vi = docVectors[i].vector;
        const idj = docVectors[j].id;
        const vj = docVectors[j].vector;
        const similarity = vi.getCosineSimilarity(vj);

        if (similarity > MIN_SCORE) {
          data[idi].push({ id: idj, score: similarity });
          data[idj].push({ id: idi, score: similarity });
        }
      }
    }

    // finally sort the similar documents by descending order
    Object.keys(data).forEach((id) => {
      data[id].sort((a, b) => b.score - a.score);

      if (data[id].length > MAX_SIMILAR) {
        data[id] = data[id].slice(0, MAX_SIMILAR);
      }
    });

    return data;
  };

  firstTimeSetUp() {
    const documentVectors = this.createVectorsFromDocs();
    this.recommendationData = this.calculateSimilarities(documentVectors);
  }

  getSimilarFood = (id) => {
    let similarFood = this.recommendationData[id];
    if (similarFood == undefined) return [];
    return similarFood;
  };
}

const recSys = new FoodRecommmendationSystem();
module.exports = recSys;
