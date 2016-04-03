import java.util.ArrayList;

public class AvoidLeftRecursor {

	// private static String leftRecursor[] = { "A->Aij|ijj|Aa|Ab|Ac|d|e|f" };

	// private static String leftRecursor= "abcd*abdc+cdba-abcd";
	// private static String leftRecursor= "abcd";

	private static String leftRecursor[] = { "E->E +T | T", "T->T* F |F", "F->(E ) | id" };

	public static void main(String[] args) {
		new AvoidLeftRecursor().avoidImmediateleftRecursor(leftRecursor);
		// new AvoidLeftRecursor().handleMixStr(leftRecursor);
		// new AvoidLeftRecursor().handleOrstr(leftRecursor);
	}

	// 处理有“或者”的情况
	void handleOrstr(String leftRecursor[]) {
		for (int i = 0; i < leftRecursor.length; i++) {
			String head = leftRecursor[i].split("->")[0];

			String tail = leftRecursor[i].split("->")[1];
			String generates[] = tail.trim().split("\\|");// 分隔符
			for (int a = 0; a < generates.length; a++) {
				ArrayList<String> geneList = new ArrayList<>();
				handleMixStr(generates[a].trim(), geneList);// 处理分隔符分开的每个元素
			}
			System.out.println("----");
		}
	}

	// 分离符号和字母混合的情况
	ArrayList<String> handleMixStr(String leftRecursor, ArrayList<String> genes) {
		// 如果都是由字母组成的话直接输出
		if (isAlphabet(leftRecursor)) {
			System.out.println(leftRecursor);
			genes.add(leftRecursor);
			return null;
		}

		for (int i = 0; i < leftRecursor.length(); i++) {
			String special = String.valueOf(leftRecursor.charAt(i));
			if (!isAlphabet(special) && !isSpace(special)) {// 不是字母也不是空格
				String conts[] = leftRecursor.split("\\" + String.valueOf(leftRecursor.charAt(i)));
				System.out.println(conts[0].trim() + leftRecursor.charAt(i));
				genes.add(conts[0].trim());
				genes.add(String.valueOf(leftRecursor.charAt(i)));
				if (isAlphabet(conts[1])) {
					// 结束条件
					System.out.println(conts[1].trim());
					genes.add(conts[1].trim());
					return null;
				}
				return handleMixStr(conts[1].trim(), genes);// 递归处理剩下的字符
			}

		}
		return null;
	}

	// 消除立即左递归
	private void avoidImmediateleftRecursor(String leftRecursor[]) {
		for (int i = 0; i < leftRecursor.length; i++) {
			String grammer = leftRecursor[i];
			if (isLeftRecursor(grammer)) {
				String parts[] = grammer.split("->");
				String head = parts[0];
				String tail = parts[1].trim();
				String generates[] = tail.split("\\|");
				String cont = head + "'" + "->";
				String notcont = head + "->";
				for (int aa = 0; aa < generates.length; aa++) {
					// 分两种情况
					if (generates[aa].contains(head)) {// 包含非终结符号
						cont += generates[aa].replace(head, "") + head + "'" + "|";
					} else {// 不包含非终结符号
						notcont += generates[aa] + head + "'" + "|";
					}

				}

				System.out.println(notcont.substring(0, notcont.length() - 1));
				System.out.println(cont + "e");// 最后一个是空
			} else {
				System.out.println(grammer);
			}
		}
	}

	// 匹配是不是由字母组成
	private boolean isAlphabet(String charactors) {
		String reg = "[a-zA-Z\\(\\)]+";
		return charactors.matches(reg);
	}

	// 匹配有没有空格
	private boolean isSpace(String str) {
		String reg = "\\s";
		return str.matches(reg);
	}

	// 判断是否有立即左递归
	private boolean isLeftRecursor(String leftRecursor) {
		if (leftRecursor.contains("->")) {
			String head = leftRecursor.split("->")[0];
			String tail = leftRecursor.split("->")[1];
			// 包含“或者”符号
			if (tail.contains("|")) {
				String allger[] = tail.split("\\|");
				for (int i = 0; i < allger.length; i++) {
					if (allger[i].startsWith(head)) {// 是立即左递归
						return true;
					}
				}
			}

		}
		return false;

	}
}
