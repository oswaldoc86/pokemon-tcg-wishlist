import React, { useEffect, useState } from "react";
import "./Filter.scss";
import { useTranslation } from "react-i18next";
import { getTypes, getSets, CardSet } from "../../api/pokemonApi";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Props: `onFilter` es una función opcional que recibirá los filtros de búsqueda.
type FilterProps = {
  // onFilter ahora recibe un objeto con `name`, `type` y `setId` opcionales
  onFilter?: (filters: {
    name?: string;
    type?: string;
    setId?: string;
  }) => void;
};

const Filter: React.FC<FilterProps> = ({ onFilter }) => {
  const { t } = useTranslation();
  // Estado para el select de tipos y la lista de tipos disponibles
  const [type, setType] = useState<string>("");
  const [typesList, setTypesList] = useState<string[]>([]);
  // Estado para sets
  const [setId, setSetId] = useState<string>("");
  const [setsList, setSetsList] = useState<CardSet[]>([]);

  // Zod: convierte strings vacías a undefined y requiere mínimo 3 caracteres si hay valor.
  const schema = z.object({
    name: z
      .string()
      .optional()
      .transform((val) => {
        if (val === undefined) return undefined;
        const trimmed = val.trim();
        return trimmed === "" ? undefined : trimmed;
      })
      .refine((val) => val === undefined || val.length >= 3, {
        message: t("explore.filter.nameMin"),
      })
      .refine((val) => val === undefined || val.length <= 100, {
        message: t("explore.filter.nameTooLong"),
      }),
  });

  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: undefined },
  });

  // Cargar la lista de tipos una vez al montar el componente
  useEffect(() => {
    let mounted = true;
    getTypes().then((list) => {
      if (mounted && Array.isArray(list)) setTypesList(list);
    });
    getSets().then((list) => {
      if (mounted && Array.isArray(list)) setSetsList(list);
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Al enviar el formulario se previene el comportamiento por defecto,
  // se recorta el valor y se llama a `onFilter` con `undefined` si está vacío.
  // Esto permite a la página padre quitar el filtro cuando el input está vacío.
  const onSubmit = (data: FormData) => {
    if (onFilter)
      onFilter({
        name: data.name,
        type: type === "" ? undefined : type,
        setId: setId === "" ? undefined : setId,
      });
  };

  // Render: un input controlado y un botón para enviar el formulario.
  // Uso de clases utilitarias para mantener la apariencia consistente.
  return (
    <form className="filter-form mb-3" onSubmit={handleSubmit(onSubmit)}>
      <div className="row g-2 align-items-center">
        <div className="col-12 col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder={t("explore.filter.placeholder")}
            aria-label={t("explore.filter.placeholder")}
            {...register("name")}
          />
        </div>
        <div className="col-12 col-md-3">
          <select
            className="form-select"
            value={type}
            onChange={(e) => setType(e.target.value)}
            aria-label={t("explore.filter.typePlaceholder")}
          >
            <option value="">
              {t("explore.filter.typeAll") || "All types"}
            </option>
            {typesList.map((ti) => (
              <option key={ti} value={ti}>
                {t(`types.${ti}`, ti)}
              </option>
            ))}
          </select>
        </div>
        <div className="col-12 col-md-4">
          <select
            className="form-select"
            value={setId}
            onChange={(e) => setSetId(e.target.value)}
            aria-label={t("explore.filter.setPlaceholder")}
          >
            <option value="">{t("explore.filter.setAll") || "All sets"}</option>
            {setsList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-12 col-md-1 d-grid">
          <button type="submit" className="btn btn-pokemon-secondary">
            {t("explore.filter.button")}
          </button>
        </div>
        {errors.name?.message && (
          <div className="col-12">
            <div className="text-danger small">
              {String(errors.name.message)}
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default Filter;
