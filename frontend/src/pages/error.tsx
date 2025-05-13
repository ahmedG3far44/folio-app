import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeProvider";
import { Link } from "react-router-dom";

function NotFoundPage() {
  const { activeTheme } = useTheme();
  return (
    <div
      style={{ backgroundColor: activeTheme.backgroundColor }}
      className="w-full min-h-screen flex flex-col items-center justify-center"
    >
      <Card className="w-[400px] border p-4 rounded-2xl shadow-md  flex items-center justify-center flex-col gap-2" style={{color:activeTheme.primaryText, backgroundColor:activeTheme.cardColor, borderColor:activeTheme.borderColor}}>
        <h1 className="text-5xl font-black">404</h1>
        <p className="text-md ">this page not found !!!</p>
        <Link to={"/"}>
          <Button>Back Home</Button>
        </Link>
      </Card>
    </div>
  );
}

export default NotFoundPage;
