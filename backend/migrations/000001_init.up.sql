SET
timezone = 'UTC';

-- пользователи
CREATE TABLE users
(
    id               SERIAL PRIMARY KEY,
    telegram_id      BIGINT UNIQUE,
    first_name       VARCHAR(50),
    last_name        VARCHAR(50),
    username         VARCHAR(50),
    subscribed_until TIMESTAMP WITH TIME ZONE,
    is_active        BOOLEAN NOT NULL         DEFAULT TRUE,
    is_bot_active    BOOLEAN NOT NULL         DEFAULT FALSE,
    created_at       TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- категории
CREATE TABLE categories
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- модели
CREATE TABLE models
(
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    category_id INT REFERENCES categories (id) ON DELETE CASCADE
);

CREATE INDEX idx_models_category_id ON models (category_id);

-- спецификации
CREATE TABLE specs
(
    id       SERIAL PRIMARY KEY,
    name     VARCHAR(255) NOT NULL,
    model_id INT REFERENCES models (id) ON DELETE CASCADE
);

CREATE INDEX idx_specs_model_id ON specs (model_id);

-- ключевые слова
CREATE TABLE keywords
(
    id      SERIAL PRIMARY KEY,
    name    VARCHAR(255) NOT NULL,
    spec_id INT REFERENCES specs (id) ON DELETE CASCADE
);

CREATE INDEX idx_keywords_spec_id ON keywords (spec_id);

-- подписки пользователей
CREATE TABLE user_specs
(
    id        SERIAL PRIMARY KEY,
    user_id   INT REFERENCES users (id) ON DELETE CASCADE,
    spec_id   INT REFERENCES specs (id) ON DELETE CASCADE,
    spec_type VARCHAR(4) NOT NULL CHECK ( spec_type IN ('sell', 'buy')),
    UNIQUE (user_id, spec_id, spec_type)
);