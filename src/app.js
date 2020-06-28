const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = {
    likes: 0,
    id: uuid(),
    title, url, techs
  }
  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body;

  const respositoryIndex = repositories.findIndex(repository => repository.id === id);
  if (respositoryIndex < 0) {
    return response.status(400).json({ "error": "Project not found" });
  }

  const repository = { id, title, url, techs, likes: 0 };
  repositories[respositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params
  const respositoryIndex = repositories.findIndex(repository => repository.id === id);
  if (respositoryIndex < 0) {
    return response.status(400).json({ "error": "Project not found" });
  }
  repositories.splice(respositoryIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params
  const repository = repositories.find(repository => repository.id === id);

  if (!repository) {
    return response.status(400).json({ "Error": "Repository not found" });
  }

  repository.likes++;

  return response.json(repository);
});

module.exports = app;
