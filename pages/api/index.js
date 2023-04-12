import axios from "axios";

export default async function handler(req, res) {
  const { method, body, query } = req;

  switch (method) {
    case "GET":
      if (query.id) {
        try {
          const response = await axios.get(`https://jsonplaceholder.typicode.com/posts/${query.id}`);
          res.status(200).json(response.data);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Internal server error" });
        }
      } else {
        try {
          const response = await axios.get("https://jsonplaceholder.typicode.com/posts");
          res.status(200).json(response.data);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Internal server error" });
        }
      }
      break;
    case "POST":
      try {
        const response = await axios.post("https://jsonplaceholder.typicode.com/posts", body);
        res.status(201).json(response.data);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
      break;
    case "PUT":
      try {
        const { id, ...data } = body;
        const response = await axios.put(`https://jsonplaceholder.typicode.com/posts/${id}`, data);
        res.status(200).json(response.data);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
      break;
    case "DELETE":
      try {
        const { id } = body;
        const response = await axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`);
        res.status(200).json(response.data);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).json({ message: `Method ${method} not allowed` });
  }
}
