import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

export const STEPS = [
  {
    value: "IN_REVIEW",
    label: "En revisión",
    Icon: InfoOutlinedIcon,
    // next: ["PARTIALLY_AVAILABLE"], // si quisieras controlar saltos
  },
  {
    value: "PARTIALLY_AVAILABLE",
    label: "Parcialmente completo",
    Icon: PlaylistAddCheckIcon,
    // next: ["READY_FOR_DISPATCH", "IN_REVIEW"],
  },
  {
    value: "READY_FOR_DISPATCH",
    label: "Completo",
    Icon: CheckCircleIcon,
    // next: ["DISPATCHED"],
  },
  {
    value: "DISPATCHED",
    label: "Enviado",
    Icon: LocalShippingIcon,
    // next: [],
  },
];
