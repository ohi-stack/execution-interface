import { NextResponse } from 'next/server';
import { accPositioning, accRepository, authorityServices, consoleModules } from '@/lib/acc-content';

export function accJson(body: Record<string, unknown>, init?: ResponseInit) {
  const response = NextResponse.json(
    {
      service: accPositioning.name,
      repository: `${accRepository.owner}/${accRepository.name}`,
      deployTarget: accRepository.deployTarget,
      authorityBoundary: accPositioning.boundary,
      ...body
    },
    init
  );
  response.headers.set('Cache-Control', 'no-store');
  response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  response.headers.set('x-onegodian-surface', 'acc');
  return response;
}

export function manifestPayload() {
  return {
    name: accPositioning.name,
    shortName: accPositioning.shortName,
    url: accRepository.deployTarget,
    repository: accRepository.url,
    interfaceOnly: true,
    noPublicSignup: true,
    modules: consoleModules,
    authorities: authorityServices
  };
}
