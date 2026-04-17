import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import dynamic from "next/dynamic";
import { FiscalProfileSchema } from "../../../schemas/user/fiscal";

const FiscalForm = dynamic(() => import("../../(user)/user/profile/fiscal/FiscalForm"), {
  ssr: false,
});

const FiscalDialog = ({
  open,
  onClose,
  defaults,
  taxRegimes,
  cfdiUses,
  onSubmit,
  submitting,
  hideIsDefault,
}) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
    <DialogTitle>Nuevos datos de facturación</DialogTitle>
    <DialogContent sx={{ paddingTop: "16px !important" }}>
      <FiscalForm
        defaults={defaults}
        schema={FiscalProfileSchema}
        taxRegimes={taxRegimes}
        cfdiUses={cfdiUses}
        onSubmit={onSubmit}
        submitting={submitting}
        onCancel={onClose}
        hideIsDefault={hideIsDefault}
      />
    </DialogContent>
  </Dialog>
);

export default FiscalDialog;
