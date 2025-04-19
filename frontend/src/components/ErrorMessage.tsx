function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="p-2 border border-red-500 text-sm text-red-500 bg-red-100 w-full rounded-md">
      {message}
    </div>
  );
}

export default ErrorMessage;
