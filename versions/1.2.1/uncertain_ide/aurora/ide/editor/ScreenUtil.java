package aurora.ide.editor;

import aurora.ide.helpers.AuroraConstant;
import uncertain.composite.CompositeMap;

public class ScreenUtil {

	
	public static CompositeMap createScreenTopNode(){
		CompositeMap model = new CompositeMap("a",AuroraConstant.ScreenQN.getNameSpace(),AuroraConstant.ScreenQN.getLocalName());
		return model;
	}
}
