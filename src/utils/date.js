import { parse, format } from "date-fns";
import { es } from "date-fns/locale";

export const formatDateDayAbrev = (createdAt) => {
    const date = parse(createdAt, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", new Date());
    return format(date, "dd 'de' MMM yy", { locale: es });
};