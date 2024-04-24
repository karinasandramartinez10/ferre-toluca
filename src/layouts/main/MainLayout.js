import { MainNavbar } from "../../navbars/main/MainNavbar";

export const MainLayout = ({ children }) => {
  return (
    <section className="main-layout">
      <nav>
        <MainNavbar />
      </nav>
      <main >{children}</main>
      <footer></footer>
    </section>
  );
};
