import { Rule } from 'eslint';
import * as ESTree from 'estree';

export type NodeWithParent = ESTree.Node & Rule.NodeParentExtension;
