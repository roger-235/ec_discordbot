FROM python:3.12-slim
WORKDIR /app
COPY package.txt .
RUN pip install -r package.txt
COPY . .
CMD [ "python3", "main.py" ]