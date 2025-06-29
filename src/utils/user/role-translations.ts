export const ROLE_LABELS: Record<string, string> = {
  owner: 'Proprietário',
  manager: 'Gerente',
  waiter: 'Atendente',
  cashier: 'Caixa',
  chef: 'Chef',
  bartender: 'Barman',
  admin: 'Administrador',
};

export function getRoleLabel(name: string): string {
  return ROLE_LABELS[name] ?? name;
}
