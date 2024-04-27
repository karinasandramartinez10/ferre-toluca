import { auth } from "../../auth";
import { MainPage } from "./MainPage";

export default async function Page() {
  const session = await auth();

  return <MainPage session={session} />;
}
