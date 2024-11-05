import { records } from '../data/osintDatabase';

interface OsintResult {
  name?: string;
  addresses?: string[];
  phones?: string[];
  error?: string;
}

export const searchByName = async (name: string): Promise<OsintResult> => {
  const searchTerm = name.toLowerCase();
  const matches = records.filter(record => 
    record.name.toLowerCase().includes(searchTerm)
  );

  if (matches.length === 0) {
    return { error: 'No records found' };
  }

  return {
    name: matches[0].name,
    addresses: matches.map(m => m.address),
    phones: matches.map(m => m.phone)
  };
};

export const searchByPhone = async (phone: string): Promise<OsintResult> => {
  const searchTerm = phone.replace(/\D/g, '');
  const match = records.find(record => 
    record.phone.replace(/\D/g, '').includes(searchTerm)
  );

  if (!match) {
    return { error: 'No records found' };
  }

  return {
    name: match.name,
    addresses: [match.address],
    phones: [match.phone]
  };
};