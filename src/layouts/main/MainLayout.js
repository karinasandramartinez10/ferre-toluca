import { MainNavbar } from "../../navbars/main/MainNavbar";

export const MainLayout = ({ children }) => {
  return (
    <section>
      <nav>
        <MainNavbar />
      </nav>
      <main className="main-layout">{children}</main>
      <footer></footer>
    </section>
  );
};
