from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from database import Base, engine, test_connection

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.get("/orders")
def get_orders():
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT * FROM Orders LIMIT 10"))

            orders = []

            for row in result:
                orders.append(dict(row._mapping))

            return orders

    except Exception as e:
        return {"error": str(e)}    