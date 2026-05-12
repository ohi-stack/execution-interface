export async function GET() {
  return Response.json({
    service: 'onegodian-capital-web',
    readiness: [
      { layer: 'Branding', status: '~80%' },
      { layer: 'Layout', status: '~70%' },
      { layer: 'Routing', status: '~60%' },
      { layer: 'Production Data', status: '~10%' },
      { layer: 'Investor Systems', status: '~5%' },
      { layer: 'Admin Systems', status: '~5%' },
      { layer: 'Verification Layer', status: '~15%' },
      { layer: 'Compliance Workflow', status: '~10%' }
    ]
  });
}
