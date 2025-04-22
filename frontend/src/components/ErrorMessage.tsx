function ErrorMessage({
  className,
  message,
}: {
  className?: string;
  message: string;
}) {
  return (
    <div
      className={`${className} "p-1  text-sm text-rose-500 bg-transparent w-full rounded-md"`}
    >
      {message}
    </div>
  );
}

export default ErrorMessage;
