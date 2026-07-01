import { SPFI } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import { ITimbit, TimbitFormat } from '../models/ITimbit';

const LIST_NAME = 'TimBits';

// Maps SharePoint item fields → ITimbit
function mapItem(item: any): ITimbit {
  return {
    id: item.Id,
    title: item.Title || '',
    date: item.TBDate || '',
    weekOf: item.WeekOf || '',
    body: item.Body || '',
    link: item.Link || '',
    format: (item.Format || 'solution') as TimbitFormat,
    categories: item.Categories ? item.Categories.split(',').map((c: string) => c.trim()) : [],
    keywords: item.Keywords || '',
    published: item.Published === true
  };
}

export async function getPublishedTimBits(sp: SPFI): Promise<ITimbit[]> {
  const items = await sp.web.lists.getByTitle(LIST_NAME).items
    .filter("Published eq 1")
    .orderBy('TBDate', false)
    .select('Id,Title,TBDate,WeekOf,Body,Link,Format,Categories,Keywords,Published')
    .top(500)();
  return items.map(mapItem);
}

export async function getAllTimBits(sp: SPFI): Promise<ITimbit[]> {
  const items = await sp.web.lists.getByTitle(LIST_NAME).items
    .orderBy('TBDate', false)
    .select('Id,Title,TBDate,WeekOf,Body,Link,Format,Categories,Keywords,Published')
    .top(500)();
  return items.map(mapItem);
}

function toSpDate(d: string): string | null {
  if (!d) return null;
  const iso = new Date(d.replace(/\//g, '-')).toISOString();
  return iso;
}

export async function createTimBit(sp: SPFI, data: Omit<ITimbit, 'id'>): Promise<number> {
  const result = await sp.web.lists.getByTitle(LIST_NAME).items.add({
    Title: data.title,
    TBDate: toSpDate(data.date),
    WeekOf: data.weekOf,
    Body: data.body,
    Link: data.link,
    Format: data.format,
    Categories: data.categories.join(','),
    Keywords: data.keywords,
    Published: data.published
  });
  return result.Id;
}

export async function updateTimBit(sp: SPFI, id: number, data: Partial<ITimbit>): Promise<void> {
  const payload: any = {};
  if (data.title !== undefined)      payload.Title = data.title;
  if (data.date !== undefined)       payload.TBDate = toSpDate(data.date);
  if (data.weekOf !== undefined)     payload.WeekOf = data.weekOf;
  if (data.body !== undefined)       payload.Body = data.body;
  if (data.link !== undefined)       payload.Link = data.link;
  if (data.format !== undefined)     payload.Format = data.format;
  if (data.categories !== undefined) payload.Categories = data.categories.join(',');
  if (data.keywords !== undefined)   payload.Keywords = data.keywords;
  if (data.published !== undefined)  payload.Published = data.published;
  await sp.web.lists.getByTitle(LIST_NAME).items.getById(id).update(payload);
}

export async function deleteTimBit(sp: SPFI, id: number): Promise<void> {
  await sp.web.lists.getByTitle(LIST_NAME).items.getById(id).delete();
}

// Returns entries from the most recent WeekOf date
export async function getLatestWeekTimBits(sp: SPFI): Promise<ITimbit[]> {
  const all = await getPublishedTimBits(sp);
  if (all.length === 0) return [];
  const latestWeek = all[0].weekOf;
  return all.filter(t => t.weekOf === latestWeek);
}
