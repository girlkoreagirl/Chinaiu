export interface StylePreset {
  id: string;
  name: string;
  imageUrl: string;
  prompt: string;
}

export interface AspectRatio {
  id: string;
  label: string;
  className: string;
  icon: JSX.Element;
}

export interface AdCopy {
  copy: string;
}

export interface FrameSetting {
  id: string;
  label: string;
}

export interface OutputSize {
  id: string;
  label: string;
}

export interface OutputFormat {
  id: string;
  label: string;
}
