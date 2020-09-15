CREATE TABLE recommend_comments(
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    request_id INTEGER REFERENCES recommend_requests(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES recommend_users(id) ON DELETE CASCADE,
    brand TEXT NOT NULL,
    why TEXT NOT NULL
);