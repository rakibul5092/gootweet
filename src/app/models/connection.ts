export interface ConnectionDesignerData {
  commission: number;
  designer_uid: string;
  request_uid: string;
  timestamp: any;
}

export interface ConnectionManufacturerData {
  commission: number;
  manufacturer_uid: string;
  request_uid: string;
  timestamp: any;
}

export interface UserInfo {
  full_name: {
    first_name: string;
    last_name: string;
  };
  profile_image: string;
  uid: string;
  rule: string;
}

export interface Connection {
  id: string;
  connectionData: ConnectionDesignerData | ConnectionManufacturerData;
  manufacturerInfo: UserInfo;
}

export interface ManufacturerConnection {
  id: string;
  connectionData: ConnectionDesignerData | ConnectionManufacturerData;
  designerInfo: UserInfo;
}
