from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["erpdb"]
user_logs_collection = db["user_logs"]