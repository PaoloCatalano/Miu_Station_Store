export default function ErrorMessage({ message }) {
  return (
    <div className="text-red-400" role="alert">
      {message}
    </div>
  );
}
