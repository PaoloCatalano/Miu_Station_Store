export default function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="text-red-400" role="alert">
      {message}
    </div>
  );
}
