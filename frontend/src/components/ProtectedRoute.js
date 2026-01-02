export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <h2>Please login first</h2>;
  }

  return children;
}
