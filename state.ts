/**
 * This is supposed to capture all properties of all possible graph states
 * obtainable from Calc.getState() or via the Desmos server.
 *
 * To compile to JSON:
 *  $ ts-to-json --path state.ts --type State > state.json
 *
 *   - This specifies additionalProperties: false and should discern what
 *     properties are required (other generators did not do this)
 *
 * Current inaccuracies:
 *  - ExpressionState
 *  - some optional keys, such as in GrapherState
 *  - probably a lot more
 */
export interface State {
  version: number;
  randomSeed: string;
  graph: GrapherState;
  expressions: ListState;
}

type ArrowMode = "NONE" | "POSITIVE" | "BOTH";

interface GrapherState {
  viewport: {
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
  };
  xAxisMinorSubdivisions: number;
  yAxisMinorSubdivisions: number;
  degreeMode: boolean;
  showGrid: boolean;
  showXAxis: boolean;
  showYAxis: boolean;
  xAxisNumbers: boolean;
  yAxisNumbers: boolean;
  polarNumbers: boolean;
  enableTabindex: boolean;
  xAxisStep: number;
  yAxisStep: number;
  xAxisArrowMode: ArrowMode;
  yAxisArrowMode: ArrowMode;
  xAxisLabel: string;
  yAxisLabel: string;
}

type Latex = string;
type ID = string;

type ListState = ItemState[];

type ItemState =
  | ExpressionState
  | ImageState
  | TableState
  | FolderState
  | TextState
  | SimulationState;

interface BaseItemModel {
  id: ID;
  secret: boolean;
}

interface NonfolderModel extends BaseItemModel {
  folderId: ID;
}

interface ExpressionState {}

interface ImageState extends NonfolderModel {
  type: "image";
  image_url: string;
  name: string;
  hidden: boolean;
  foreground: boolean;
}

interface TableColumn {
  id: ID;
  values: Latex[];
  color: string;
  latex?: Latex;
  hidden?: boolean;
  points?: boolean;
  lines?: boolean;
  dragMode?: "NONE" | "X" | "Y" | "XY" | "AUTO";
  lineStyle?: "SOLID" | "DASHED" | "DOTTED";
  pointStyle?: "POINT" | "OPEN" | "CROSS";
  colorLatex?: Latex;
  lineOpacity?: Latex;
  lineWidth?: Latex;
  pointSize?: Latex;
  pointOpacity?: Latex;
}

interface TableState extends NonfolderModel {
  type: "table";
  columns: TableColumn[];
}

interface FolderState extends BaseItemModel {
  type: "folder";
  hidden?: boolean;
  collapsed?: boolean;
  title?: string;
}

interface TextState extends NonfolderModel {
  type: "text";
  text?: string;
}

interface SimulationState extends NonfolderModel {
  type: "simulation";
  isPlaying?: boolean;
}
