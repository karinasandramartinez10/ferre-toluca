import { Suspense } from "react";
import CustomersHub from "./CustomersHub";

export default function ClientsPage() {
  return (
    <Suspense>
      <CustomersHub />
    </Suspense>
  );
}
