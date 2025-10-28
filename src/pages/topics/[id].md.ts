import { getCollection, type CollectionEntry } from 'astro:content';
import { getUrl } from '../../utils';
import type { APIContext } from 'astro';
import { getTopicData, type ShiftWithProjects, type TopicData } from '../../model/model';

export async function getStaticPaths() {
  const topics = await getCollection('topics');
  return Promise.all(topics.map(async (topic) => ({
    params: { id: topic.id },
    props: await getTopicData(topic),
  })));
}

type Options = {
  baseUrl: string,
}

const projectToMarkdown = (project: CollectionEntry<'projects'>, { baseUrl }: Options) => {
  const url = `${baseUrl}${getUrl(`/projects/${project.id}.md`)}`;
  return `### ${project.data.name}\n\n[Více informací o projektu](${url})\n\n${project.data.perex}\n\n`;
}

const shiftToTableRow = ({ shift, projects }: ShiftWithProjects, options: Options) => {
  const projectsList = projects.map(project => project.data.name).join(', ');
  return `| ${shift.data.name} | ${shift.data.statusQuo} | ${shift.data.desiredState} | ${projectsList} |`
}

const shiftsToTable = (data: ShiftWithProjects[], options: Options) => {
  const body = data.map((entry) => shiftToTableRow(entry, options)).join('\n');
  return `| Název | Status quo | Cílový stav | Projekty |\n|---|---|---|---|\n${body}`; 
}


export async function GET({ site, props }: APIContext<TopicData>) {
  const { topic, criticalShifts, projects } = props;

  const options = { baseUrl: site?.origin || ''};

  const content = `# ${topic.data.name}

${topic.body}

## Critical shifts

${criticalShifts.map(x => `### ${x.category}\n\n${shiftsToTable(x.shifts, options)}`).join('\n\n')}

## Informace o projektech

${projects.map((project) => projectToMarkdown(project, options)).join('\n')}

`;

  return new Response(content);
}

