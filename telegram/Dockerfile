FROM python:3.12.11-slim

COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    libffi-dev \
    libssl-dev \
    build-essential \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

COPY pyproject.toml uv.lock ./

RUN uv sync

COPY . .

EXPOSE 8000

CMD ["uv", "run", "python", "-m", "app.main"]
