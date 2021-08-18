export const CoursesAndSections = (rows: any) => {
  const parsedResults: any[] = [];
  let currentCourse: any = { secciones: [] };

  rows.forEach((row: any) => {
    if (currentCourse.cursoId !== row.curso_id) {
      currentCourse = { cursoId: row.curso_id, cursoNombre: row.curso_nombre, secciones: [] };
      parsedResults.push(currentCourse);
    }
    currentCourse.secciones.push({ seccion: row.seccion, seccionId: row.seccion_id });
  });

  return parsedResults;
};
