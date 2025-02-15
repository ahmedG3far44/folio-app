function Skeleton() {
  return (
    <div className="w-full flex justify-start items-center gap-4 p-2 animate-pulse">
      <div className="w-10 h-10 rounded-full bg-zinc-700"></div>
      <div className="max-w-40 flex flex-col justify-start items-start gap-2">
        <h1 className="p-2 rounded-lg bg-zinc-700 w-40"></h1>
        <h2 className="p-2 rounded-lg bg-zinc-700 w-3/4"></h2>
      </div>
    </div>
  );
}

export default Skeleton;
