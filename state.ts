/**
 * Useful sources:
 *  - core/types/*
 *  - graphing-calc/models/*
 *  - core/graphing-calc/json/*
 */
export interface State {
  version: 8;
  randomSeed?: string;
  graph: GrapherState;
  expressions: {
    list: ListState;
  };
}

export type ArrowMode = "NONE" | "POSITIVE" | "BOTH";

export interface GrapherState {
  viewport: {
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
  };
  // {x,y}AxisMinorSubdivisions appears to be either 5 or 0 (disabled)
  // but Desmos accepts other subdivisions
  xAxisMinorSubdivisions?: number;
  yAxisMinorSubdivisions?: number;
  degreeMode?: boolean;
  showGrid?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  // the UI appears to only have xAxisNumbers = yAxisNumbers = polarNumbers
  xAxisNumbers?: boolean;
  yAxisNumbers?: boolean;
  polarNumbers?: boolean;
  // {x,y}AxisStep are interesting. The user can put any LaTeX, but the result is stored as a
  // number and displayed as a number or multiple of pi
  xAxisStep?: number;
  yAxisStep?: number;
  xAxisArrowMode?: ArrowMode;
  yAxisArrowMode?: ArrowMode;
  xAxisLabel?: string;
  yAxisLabel?: string;
  squareAxes?: boolean;
  restrictGridToFirstQuadrant?: boolean;
  polarMode?: boolean;
}

type Latex = string;
type ID = string;

export type ListState = ItemState[];

export type ItemState =
  | ExpressionState
  | ImageState
  | TableState
  | FolderState
  | TextState
  | SimulationState;

export interface BaseItemModel {
  id: ID;
  secret?: boolean;
}

export interface NonfolderModel extends BaseItemModel {
  folderId?: ID;
}

export type LineStyle = "SOLID" | "DASHED" | "DOTTED";
export type PointStyle = "POINT" | "OPEN" | "CROSS";
export type DragMode = "NONE" | "X" | "Y" | "XY";
export type LabelSize = "SMALL" | "MEDIUM" | "LARGE" | Latex;
export type LabelOrientation =
  | "default"
  | "center"
  | "center_auto"
  | "auto_center"
  | "above"
  | "above_left"
  | "above_right"
  | "above_auto"
  | "below"
  | "below_left"
  | "below_right"
  | "below_auto"
  | "left"
  | "auto_left"
  | "right"
  | "auto_right";

export type ClickableInfoRules = {
  id: string;
  expression: Latex;
  assignment: Latex;
}[];

export interface Domain {
  min: Latex;
  max: Latex;
}

export interface MaybeClickable {
  clickableInfo?: {
    enabled?: boolean;
    // description is the screen reader label
    description?: string;
    rules?: ClickableInfoRules;
  };
}
export interface ExpressionState extends NonfolderModel, MaybeClickable {
  type: "expression";
  color: string;
  latex?: Latex;
  showLabel?: boolean;
  label?: string;
  hidden?: boolean;
  points?: boolean;
  lines?: boolean;
  lineStyle?: LineStyle;
  pointStyle?: PointStyle;
  fill?: boolean;
  dragMode?: DragMode;
  labelSize?: LabelSize;
  // Type of labelOrientation is too broad
  labelOrientation?: LabelOrientation;
  // extendedLabelOrientation seems like it is renamed to labelOrientation in state version 9
  extendedLabelOrientation?: LabelOrientation;
  suppressTextOutline?: boolean;
  // interactiveLabel is show-on-hover
  interactiveLabel?: boolean;
  editableLabelMode?: "MATH" | "TEXT";
  residualVariable?: Latex;
  regressionParameters?: {
    // key should be Latex, but type aliases are not allowed as keys
    [key: string]: number;
  };
  isLogModeRegression?: boolean;
  displayEvaluationAsFraction?: boolean;
  slider?: {
    hardMin?: boolean;
    hardMax?: boolean;
    animationPeriod?: number;
    loopMode?:
      | "LOOP_FORWARD_REVERSE"
      | "LOOP_FORWARD"
      | "PLAY_ONCE"
      | "PLAY_INDEFINITELY";
    playDirection?: 1 | -1;
    isPlaying?: boolean;
    min?: Latex;
    max?: Latex;
    step?: Latex;
  };
  polarDomain?: Domain;
  parametricDomain?: Domain;
  // seems like `domain` may be the same as `parametricDomain`
  domain?: Domain;
  cdf?: {
    show: boolean;
    min?: Latex;
    max?: Latex;
  };
  colorLatex?: Latex;
  fillOpacity?: Latex;
  lineOpacity?: Latex;
  pointOpacity?: Latex;
  pointSize?: Latex;
  lineWidth?: Latex;
  labelAngle?: Latex;
  vizProps?: {
    // -- Applies to boxplot only:
    // axisOffset=offset and breadth=height (boxplots only)
    breadth?: Latex;
    axisOffset?: Latex;
    alignedAxis?: "x" | "y";
    showBoxplotOutliers?: boolean;
    // -- Applies to dotplot only:
    // dotplotSize is removed in state version 9
    // "small" corresponds to pointSize=9; "large" corresponds to pointSize=20
    dotplotSize?: "small" | "large";
    // the string "binned" is never actually checked,
    // just inferred by the absence of "exact"
    dotplotXMode?: "exact" | "binned";
    // -- applies to dotplot and histogram only:
    binAlignment?: "left" | "center";
    // -- applies to histogram only:
    // the string "count" is never actually checked,
    // just inferred by the absence of "relative" and "density"
    histogramMode?: "count" | "relative" | "density";
  };
}

export interface ImageState extends NonfolderModel, MaybeClickable {
  type: "image";
  image_url: string;
  name?: string;
  width?: Latex;
  height?: Latex;
  hidden?: boolean;
  center?: Latex;
  angle?: Latex;
  opacity?: Latex;
  foreground?: boolean;
  draggable?: boolean;
}

export interface TableColumn {
  id: ID;
  values: Latex[];
  color: string;
  latex?: Latex;
  hidden?: boolean;
  points?: boolean;
  lines?: boolean;
  dragMode?: DragMode;
  lineStyle?: LineStyle;
  pointStyle?: PointStyle;
  colorLatex?: Latex;
  lineOpacity?: Latex;
  lineWidth?: Latex;
  pointSize?: Latex;
  pointOpacity?: Latex;
}

export interface TableState extends NonfolderModel {
  type: "table";
  columns: TableColumn[];
}

export interface FolderState extends BaseItemModel {
  type: "folder";
  hidden?: boolean;
  collapsed?: boolean;
  title?: string;
}

export interface TextState extends NonfolderModel {
  type: "text";
  text?: string;
}

export interface SimulationState extends NonfolderModel {
  type: "simulation";
  isPlaying?: boolean;
  fps?: Latex;
  clickableInfo?: {
    rules: ClickableInfoRules;
    // enabled appears removed. Only saw it in one of my graphs, so it might be manually placed there
    enabled?: boolean;
  };
}
