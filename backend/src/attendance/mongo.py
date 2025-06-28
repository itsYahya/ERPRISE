from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["erpdb"]
attendance_collection = db["attendance"]