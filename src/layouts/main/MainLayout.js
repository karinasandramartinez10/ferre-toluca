import { Footer } from "../../components/Footer";
import NavigationMenu from "../../components/NavigationMenu/NavigationMenu";
import { MainNavbar } from "../../navbars/main/MainNavbar";

export const MainLayout = ({
  children,
  categories,
  AppBarProps,
  ToolbarProps,
}) => {
  return (
    <section>
      <nav>
        <MainNavbar AppBarProps={AppBarProps} ToolbarProps={ToolbarProps} />
      </nav>
      <section>
        <NavigationMenu categories={categories} />
      </section>
      <main className="main-layout">{children}</main>
      <Footer />
    </section>
  );
};
