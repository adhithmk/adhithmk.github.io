from setuptools import setup, find_packages

setup(
    name="academic-website-api",
    version="1.0.0",
    packages=find_packages(),
    install_requires=[
        "fastapi>=0.115.0",
        "uvicorn>=0.22.0",
        "python-dotenv>=1.0.0",
        "sqlalchemy>=1.4.0",
        "arxiv>=1.4.7",
        "tweepy>=4.14.0"
    ],
    python_requires=">=3.8"
)
