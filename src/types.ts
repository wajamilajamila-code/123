export interface TraceRecord {
  id: string;
  stageName: string; // e.g., "生产采摘", "清洗分拣", "抽样质检", "包装封签", "物流运输"
  operator: string;
  timestamp: string;
  location: string;
  description: string;
  txHash: string;
  blockNumber: number;
}

export interface TrademarkInfo {
  regNo: string; // Trademark registration number
  owner: string; // Owner company name
  category: string; // Trademark class
  validPeriod: string; // Validity
  logoUrl?: string;
  status: 'valid' | 'expired' | 'pending';
}

export interface Product {
  id: string; // The primary Trace Code (溯源码), typically a hash or UUID
  name: string;
  category: string; // '水果蔬菜' | '休闲副食' | '非遗手工艺' | '其他'
  origin: string;
  producer: string;
  price: number;
  imageUrl: string; // Authentic image of the product for AI visual comparison
  specDetails: string; // Custom key-value pairs or text
  blockchainHash: string; // Initial block hash
  registeredAt: string;
  trademarkRegNo: string; // Associated trademark
  records: TraceRecord[];
}

export interface Block {
  index: number;
  timestamp: string;
  txCount: number;
  hash: string;
  previousHash: string;
  merkleRoot: string;
  data: {
    productId?: string;
    productName?: string;
    action?: string;
    stage?: string;
    operator?: string;
    txHash: string;
  }[];
}

export interface ScanLog {
  id: string;
  productId: string;
  productName: string;
  timestamp: string;
  location: string;
  ip: string;
  device: string;
  verificationStatus: 'success' | 'warning' | 'danger'; // Normal scan, suspicious (repeated scan), altered image
  details: string;
}

export interface ReportSection {
  id: string;
  title: string;
  subSections: {
    title: string;
    content: string;
    tips?: string; // Guidance according to guidelines
  }[];
}
