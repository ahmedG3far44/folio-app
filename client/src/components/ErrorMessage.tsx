function ErrorMessage({
  className,
  message,
}: {
  className?: string;
  message: string;
}) {
  return (
    <p
      className={`${className} text-xs text-rose-400 w-full`}
    >
      {message}
    </p>
  );
}

export default ErrorMessage;
