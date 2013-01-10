package aurora.ide.meta.gef.editors.source.gen.core;

import java.util.List;

import uncertain.composite.CompositeMap;
import aurora.ide.api.composite.map.CommentCompositeMap;
import aurora.ide.meta.gef.Util;
import aurora.ide.meta.gef.designer.BMCompositeMap;
import aurora.ide.meta.gef.editors.models.AuroraComponent;
import aurora.ide.meta.gef.editors.models.BOX;
import aurora.ide.meta.gef.editors.models.Button;
import aurora.ide.meta.gef.editors.models.CheckBox;
import aurora.ide.meta.gef.editors.models.Dataset;
import aurora.ide.meta.gef.editors.models.Grid;
import aurora.ide.meta.gef.editors.models.GridColumn;
import aurora.ide.meta.gef.editors.models.GridSelectionCol;
import aurora.ide.meta.gef.editors.models.IDatasetFieldDelegate;
import aurora.ide.meta.gef.editors.models.Input;
import aurora.ide.meta.gef.editors.models.TabFolder;
import aurora.ide.meta.gef.editors.models.TabItem;
import aurora.ide.meta.gef.editors.models.Toolbar;
import aurora.ide.meta.gef.editors.models.ViewDiagram;
import aurora.ide.meta.gef.editors.source.gen.BoxMap;
import aurora.ide.meta.gef.editors.source.gen.ButtonMap;
import aurora.ide.meta.gef.editors.source.gen.CheckBoxMap;
import aurora.ide.meta.gef.editors.source.gen.DataSetFieldUtil;
import aurora.ide.meta.gef.editors.source.gen.DatasetFieldMap;
import aurora.ide.meta.gef.editors.source.gen.DatasetMap;
import aurora.ide.meta.gef.editors.source.gen.GridColumnMap;
import aurora.ide.meta.gef.editors.source.gen.GridMap;
import aurora.ide.meta.gef.editors.source.gen.InputMap;
import aurora.ide.meta.gef.editors.source.gen.TabFolderMap;
import aurora.ide.meta.gef.editors.source.gen.TabItemMap;

public class AuroraComponent2CompositMap {
	public static final String SCREEN_PREFIX = "a";

	static public CompositeMap createScreenCompositeMap() {
		CompositeMap screen = new CommentCompositeMap("screen");
		screen.setNameSpace(SCREEN_PREFIX,
				"http://www.aurora-framework.org/application");
		return screen;
	}

	private ScreenGenerator screenGenerator;

	public AuroraComponent2CompositMap(ScreenGenerator screenGenerator) {
		this.screenGenerator = screenGenerator;
	}

	static public CompositeMap createChild(String name) {
		CompositeMap node = new CommentCompositeMap(name);
		node.setPrefix(SCREEN_PREFIX);
		return node;
	}

	public CompositeMap toCompositMap(AuroraComponent c) {
		if (c instanceof Input) {
			return new InputMap((Input) c).toCompositMap();
		}
		if (c instanceof Button) {
			return new ButtonMap((Button) c).toCompositMap();
		}
		if (c instanceof BOX) {
			return new BoxMap((BOX) c).toCompositMap();
		}
		if (c instanceof CheckBox) {
			return new CheckBoxMap((CheckBox) c).toCompositMap();
		}
		if (c instanceof Grid) {
			return new GridMap((Grid) c).toCompositMap();
		}
		if (c instanceof GridSelectionCol) {
			return null;
		}
		if (c instanceof GridColumn) {
			return new GridColumnMap((GridColumn) c, screenGenerator)
					.toCompositMap();
		}
		if (c instanceof Dataset) {
			return new DatasetMap((Dataset) c).toCompositMap();
		}

		if (c instanceof Toolbar) {
			return createChild("toolBar");
		}
		if (c instanceof TabItem) {
			return new TabItemMap((TabItem) c).toCompositMap();
		}
		if (c instanceof TabFolder) {
			return new TabFolderMap((TabFolder) c).toCompositMap();
		}
		if (c instanceof ViewDiagram) {
			return createChild("view");
		}

		return null;
	}

	public void bindDatasetField(CompositeMap dsMap, Dataset dataset,
			AuroraComponent ac) {
		if (ac instanceof IDatasetFieldDelegate) {
			DatasetFieldMap dfm = new DatasetFieldMap(dsMap, dataset, ac,
					this.screenGenerator);
			dfm.toCompositMap();
		}
	}

	public void doLovMap(Dataset ds, AuroraComponent ac, CompositeMap lovMap) {
		if (ds == null) {
			return;
		}
		CompositeMap containerMap = lovMap.getParent();
		DataSetFieldUtil dataSetFieldUtil = new DataSetFieldUtil(
				screenGenerator.getProject(), ac.getName(), ds.getModel());

		CompositeMap optionsMap = dataSetFieldUtil.getOptionsMap();
		BMCompositeMap opb = null;
		if (optionsMap != null) {
			opb = new BMCompositeMap(optionsMap);
		}

		CompositeMap bmMap = dataSetFieldUtil.getBmMap();
		if (bmMap == null)
			return;
		MapFinder mf = new MapFinder();
		CompositeMap relation = mf.lookupRelation(lovMap.getString("name", ""),
				bmMap);
		if (relation != null) {
			String rName = relation.getString("name", "");
			List<CompositeMap> lovFields = mf.lookupLovFields(rName, bmMap);
			for (CompositeMap compositeMap : lovFields) {
				CompositeMap clone = (CompositeMap) lovMap.clone();

				String source = Util.getCompositeValue("sourceField",
						compositeMap);
				String name = Util.getCompositeValue("name", compositeMap);
				if (opb == null || opb.getFieldByName(source) == null)
					continue;
				if (null != name && !"".equals(name)) {
					clone.put("name", name);
					containerMap.addChild(clone);
				}
			}
			containerMap.removeChild(lovMap);
			return;
		}
	}
}
