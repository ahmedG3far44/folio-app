import { useTheme } from "@/contexts/ThemeProvider";

function Footer() {
  const { activeTheme } = useTheme();
  return (
    <div
      className="w-full flex items-center justify-center p-8 mt-auto"
      style={{
        backgroundColor: activeTheme.cardColor,
        color: activeTheme.primaryText,
      }}
    >
      <div>
        <h1>Logo</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia
          officiis minima rem, id eos eaque doloremque. Esse tempora assumenda
          ut veniam. Fuga ratione nemo recusandae autem molestiae deleniti fugit
          impedit.
        </p>
      </div>
    </div>
  );
}

export default Footer;
