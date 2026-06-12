import { NextResponse } from 'next/server';
import { appPositioning, appRepository, dashboardModules, domainStructure, pluginShortcodes, tools } from '@/lib/acc-content';

export function appJson(body: Record<string, unknown>, init?: ResponseInit) {
  const response = NextResponse.json(
    {
      service: appPositioning.name,
      repository: `${appRepository.owner}/${appRepository.name}`,
      deployTarget: appRepository.deployTarget,
      domainRole: 'public/member-facing app gateway',
      ...body
    },
    init
  );
  response.headers.set('Cache-Control', 'no-store');
  response.headers.set('x-onegodian-surface', 'app');
  return response;
}

export const accJson = appJson;

export function manifestPayload() {
  return {
    name: appPositioning.name,
    appName: 'OneGodian App',
    shortName: appPositioning.shortName,
    version: appPositioning.version,
    url: appRepository.deployTarget,
    repository: appRepository.url,
    domainRole: 'public/member-facing app gateway',
    modules: dashboardModules,
    routes: ['/', ...dashboardModules.map((module) => module.href), '/ecosystem'],
    wordpressPluginBridgeShortcodes: pluginShortcodes,
    domains: domainStructure
  };
}

export function toolsPayload() {
  return { tools };
}
