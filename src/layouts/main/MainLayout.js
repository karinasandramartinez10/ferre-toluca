import { MainNavbar } from "../../navbars/main/MainNavbar";

export const MainLayout = ({ children, AppBarProps, ToolbarProps }) => {
  return (
    <section>
      <nav>
        <MainNavbar AppBarProps={AppBarProps} ToolbarProps={ToolbarProps} />
      </nav>
      <main className="main-layout">{children}</main>
      <footer></footer>
    </section>
  );
};
