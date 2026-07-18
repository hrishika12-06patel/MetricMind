from fastapi import FastAPI
from database import Base, engine, test_connection

app = FastAPI()

# Create tables and test connection on startup
@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
    test_connection()

@app.get("/")
def root():
    return {"message": "Backend is running!"}

@app.get("/db-test")
def db_test():
    return {"status": "Database connected successfully!"}