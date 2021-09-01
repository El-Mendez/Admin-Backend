export const CoursesAndSections = (rows: any[]) => {
  const grouped = rows.reduce((result, row) => {
    if (!result[row.curso_id]) {
      // eslint-disable-next-line no-param-reassign
      result[row.curso_id] = {
        cursoId: row.curso_id,
        cursoNombre: row.curso_nombre,
        secciones: [],
      };
    }

    result[row.curso_id].secciones.push({ seccion: row.seccion, seccionId: row.seccion_id });

    return result;
  }, {});

  return Object.values(grouped);
};
