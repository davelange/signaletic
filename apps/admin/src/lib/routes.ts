const VISUALIZER_URL = import.meta.env.VITE_VISUALIZER_URL;

export const routes = {
  HOME: `/`,
  PROJECT: (slug: string) => `/projects/${slug}`,
  DISPLAY: (projectId: number, displayId: number, baseDate?: string) =>
    `${VISUALIZER_URL}/${projectId}/displays/${displayId}${baseDate ? `?baseDate=${baseDate}` : ''}`,
  TEMPLATE: (templateId: number) =>
    `${VISUALIZER_URL}/edit/template/${templateId}`,
  SCENE_TEMPLATE: (templateId: number, sceneId: number) =>
    `${VISUALIZER_URL}/edit/template/${templateId}?displaySceneId=${sceneId}`
};
