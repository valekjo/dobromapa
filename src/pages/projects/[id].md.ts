import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { getUrl } from '../../utils';
import { getProjectData, type ProjectData } from '../../model/model';
import type { APIContext } from 'astro';

export async function getStaticPaths() {
  const projects = await getCollection('projects');
  return Promise.all(projects.map(async (project) => ({
    params: { id: project.id },
    props: await getProjectData(project),
  })));
}



export async function GET({ site, props }: APIContext<ProjectData>) {
  const { project, criticalShifts } = props;

  const shifts = criticalShifts.map(shift => `- [${shift.data.name}](${site?.origin}${getUrl(`/topics/${shift.data.topic.id}#${shift.id}`)})`)


  const content = `# ${project.data.name}

## Critical shifts

${shifts.join('\n')}

## Obsah

${project.body}

## Odkaz na web projektu

[${project.data.url}](${project.data.url})
`;

  return new Response(content);
}

