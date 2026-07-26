import os

class Settings:
    PROJECT_NAME: str = "MediVision AI"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./data.db")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "super_secret_medivision_key_123456789")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 120
    
    # CORS Origins
    BACKEND_CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

settings = Settings()
