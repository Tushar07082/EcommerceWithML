import pickle
import pandas as pd
from flask import Flask, request, jsonify;
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
file_path = "userAndProductsViewedData.csv"




def recommend_products(data,user_id,user_similarity, num_recommendations=5):
    user_index = data.index.get_loc(user_id)
    sim_scores = list(enumerate(user_similarity[user_index]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    top_similar_users = sim_scores[1:num_recommendations+1]

    recommendations = []
    for user in top_similar_users:
        similar_user_index = user[0]
        products_interacted = data.iloc[similar_user_index]
        products_to_recommend = products_interacted[products_interacted == 0].index
        recommendations.extend(products_to_recommend)

    return recommendations[:num_recommendations]

  

# API Endpoint for Recommendations
@app.route('/recommendations', methods=['POST'])
def get_recommendations():
    user_id = request.json['_id']

    data = pd.read_csv(file_path,index_col=None)
    print("data",data);
    data.set_index('users', inplace=True)

    user_similarity_matrix = cosine_similarity(data)
    
    recommendations = recommend_products(data,user_id, user_similarity_matrix)
    return jsonify({'recommendations': recommendations})


if __name__ == '__main__':
    app.run(debug=True)



